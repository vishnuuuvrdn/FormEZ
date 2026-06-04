export const PageWrapper = ({ children, className = "" }) => {
  return (
    <div className={`max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-10 pb-24 md:pb-12 ${className}`}>
      {children}
    </div>
  );
};

export default PageWrapper;
