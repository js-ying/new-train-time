export default function Layout({ children, title = "" }) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-center">{title}</h1>
      </div>
      {children}
    </div>
  );
}
