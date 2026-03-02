export default function BombomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=Changa:wght@400;600;800&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
