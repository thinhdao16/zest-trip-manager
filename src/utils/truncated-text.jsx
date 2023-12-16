/* eslint-disable react/destructuring-assignment */
// eslint-disable-next-line react/prop-types
const TruncatedText = ({ text, maxLength }) => {
  const truncatedContent =
    // eslint-disable-next-line react/prop-types
    text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  return <>{truncatedContent}</>;
};

export default TruncatedText;
