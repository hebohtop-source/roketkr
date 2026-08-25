type PageContentProps = {
  html: string;
};

export default function PageContent({ html }: PageContentProps) {
  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
