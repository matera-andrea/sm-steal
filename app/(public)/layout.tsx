import Footer from "../components/common/Footer";
import NavBar from "../components/common/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center">
        <div
          className="relative w-full
                h-[calc(100vh-167px)] xs:h-[50vh]"
        >
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
