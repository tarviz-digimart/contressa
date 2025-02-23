import { fontSize } from 'fluid-tailwind';
import { properties } from './styles';
export const fontStyle = () => {
  const prop = properties();
  return {
    heading: {
      fontSize: '1.5rem',
      fontWeight: '600',
    },
    subHeading: {
      fontSize: '1.25rem',
      fontWeight: '500',
    },
    body: {
      fontSize: '1rem',
      fontWeight: '400',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: '400',
    },
  };
};
