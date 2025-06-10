import pyotp
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
from .models import PendingOTP  # Assuming you have this model
import uuid
from base.models import CustomUser
from datetime import datetime
from rest_framework_simplejwt.tokens import RefreshToken

class OTPLoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)
        if user is None:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        otp_secret = pyotp.random_base32()
        pending_token = str(uuid.uuid4()) # Generate a UUID for the pending token

        pending_record, _ = PendingOTP.objects.update_or_create(
            user=user,
            defaults={'otp_secret': otp_secret, 'pending_token': pending_token}
        )

        totp = pyotp.TOTP(otp_secret, interval=240)
        otp_code = totp.now()
        if settings.TEST_MODE:
            print("*** You're in TEST MODE ***")
            pending_record.raw_otp=otp_code
            pending_record.save(update_fields=["raw_otp"])
            print("Saved raw_otp:", pending_record.raw_otp)


        send_mail(
            'Your OTP Code',
            f'Your OTP code is {otp_code}. It will expire in 4 minutes.',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )


        return Response({
            'detail': 'OTP sent to email.',
            'pending_token': pending_token,
        }, status=status.HTTP_200_OK)


class OTPVerifyView(APIView):
    def post(self, request, *args, **kwargs):
        pending_token = request.data.get('pending_token')
        otp_submitted = request.data.get('otp')

        if not pending_token or not otp_submitted:
            return Response({'detail': 'Both pending_token and otp are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            pending_record = PendingOTP.objects.get(pending_token=pending_token)
        except PendingOTP.DoesNotExist:
            return Response({'detail': 'Invalid or expired pending token.'}, status=status.HTTP_400_BAD_REQUEST)

        totp = pyotp.TOTP(pending_record.otp_secret, interval=240)  # Use stored secret

        if not totp.verify(otp_submitted, valid_window=1):
            return Response({'detail': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        user = pending_record.user
        pending_record.delete()

        refresh = RefreshToken.for_user(user)
        organization = user.organization  

        return Response({
            'detail': 'Login successful',
            'access': str(refresh.access_token), # access token
            'refresh': str(refresh), # refresh token
            "Organization": organization.id if organization else None,
        }, status=status.HTTP_200_OK)


class ResendOTPView(APIView):
    """
    Resend OTP: Invalidate all previous OTPs and generate a new one for the user.
    """
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')  # Or however you identify the user

        if not email:  # Basic validation
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)  # Assuming you have a User model
        except CustomUser.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Invalidate previous OTPs (important!)
        PendingOTP.objects.filter(user=user).delete()

        otp_secret = pyotp.random_base32()
        pending_token = str(uuid.uuid4())

        pending_record = PendingOTP.objects.create(  # No need for update_or_create here
            user=user,
            otp_secret=otp_secret,
            pending_token=pending_token
        )

        totp = pyotp.TOTP(otp_secret, interval=240)
        otp_code = totp.now()


        send_mail(
            'Your New OTP Code',  # More descriptive subject
            f'Your new OTP code is {otp_code}. It will expire in 4 minutes.',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        print("=================================================================")
        print(f'Your new OTP code is {otp_code}. It will expire in 4 minutes.')
        print("=================================================================")

        return Response({
            'detail': 'New OTP sent to email.',
            'pending_token': pending_token,  # Return the new pending token          
        }, status=status.HTTP_200_OK)