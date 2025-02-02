export const properties = () => {
  return {
    borderRadius: {
      two: '0.125rem', // 2px xs
      five: '0.3125rem', // 5px sm
      six: '0.375rem', // 6px md
      eight: '0.5rem', // 8px lg
      ten: '0.625rem', //10px xl
      twelve: '0.75rem', // 12px xl2
      fifteen: '0.938rem', // 15px xl3
      twentyFour: "1.5rem", //24px
    },
    borderWidth: {
      xs: '1px',
      sm: '2px',
      md: '4px',
      lg: '8px',
    },
    boxShadow: {
      xs: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
    },
    fontWeight: {
      light: '300',
      regular: '400',   //Mostly used
      medium: '500',
      semiBold: '600',  //Mostly used
      bold: '700',      //Mostly used
      bolder: '900',
    },

    fontStyle: {
      normal: 'normal',
      italic: 'italic',
    },

    fontSize: {
      twelve: '0.75rem',     // 12px Subtext
      fourteen: '0.875rem',  // 14px Helper Text 
      sixteen:  '1rem',      // 16px Form Labels & Body Text
      twentyFour: '1.4rem',  // 24px H3
      thirtyTwo: '2rem',     // 32px H2
      fourtyEight: '3rem',   // 48px H1
    },
    textTransform: {
      default: 'capitalize',
    },
  }
}
