from django.http import JsonResponse
from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_mail(request, to_emails, subject, html_content):

    message = Mail(
        from_email=settings.SENDGRID_SENDER,
        to_emails=to_emails,
        subject=subject,
        html_content=html_content)
    try:
        sg = SendGridAPIClient(settings.SENDGRIP_API_KEY)
        response = sg.send(message)
        return JsonResponse({'status': response.status_code, 'message': 'Email sent successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
