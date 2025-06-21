type ListingsHeaderProps = {
  title: string;
  description: string;
};

export default function ListingsHeader({ title, description }: ListingsHeaderProps) {
  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-extrabold text-[#38bdf8] drop-shadow-md">{title}</h1>
      <p className="text-gray-300 mt-2 text-lg">{description}</p>
    </div>
  );
}
