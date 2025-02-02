import { properties } from "./styles";
export const fontStyle = () => {
  const prop = properties();
  return {
    b1: {
      //Subtext
      fontSize: prop.fontSize.twelve,
      fontWeight: prop.fontWeight.regular,
    },
    b2: {
      //Helper Text
      fontSize: prop.fontSize.fourteen,
      fontWeight: prop.fontWeight.regular,
    },
    b3: {
      //Form Labels and body text
      fontSize: prop.fontSize.sixteen,
      fontWeight: prop.fontWeight.regular,
    },
    b4: {
      //Links/Buttons
      fontSize: prop.fontSize.sixteen,
      fontWeight: prop.fontWeight.semiBold,
    },
    h1: {
      //Section Title
      fontSize: prop.fontSize.twentyFour,
      fontWeight: prop.fontWeight.semiBold,
    },
    h2: {
      //SubHeading
      fontSize: prop.fontSize.thirtyTwo,
      fontWeight: prop.fontWeight.semiBold,
    },
    h3: {
      //Main Heading
      fontSize: prop.fontSize.fourtyEight,
      fontWeight: prop.fontWeight.bold,
    },
  };
};
