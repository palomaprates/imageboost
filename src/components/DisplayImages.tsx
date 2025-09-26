export default function DisplayImages({
  imageUrls,
}: {
  imageUrls: string[] | null;
}) {
  return (
    <div className="flex items-center justify-center gap-10">
      {imageUrls && (
        <div className="mt-4 flex flex-col items-center justify-center">
          <div className="flex gap-4 items-center justify-center">
            {imageUrls.slice(1).map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Variação ${i + 1}`}
                width={400}
                height={300}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
