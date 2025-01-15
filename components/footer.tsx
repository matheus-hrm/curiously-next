export default function FooterPage() {
  return (
    <footer className="flex justify-center items-center text-sm  text-stone-600/60">
      <div className="flex-row flex space-x-6 ">
        <div className="flex flex-col">
          <p className="hover:underline">Terms of Service</p>
          <p className="hover:underline">Privacy Policy</p>
        </div>
        <div className="flex flex-col">
          <p className="hover:underline">Cookie Policy</p>
          <p className="hover:underline">© 2025 Curiously</p>
        </div>
      </div>
    </footer>
  );
}
