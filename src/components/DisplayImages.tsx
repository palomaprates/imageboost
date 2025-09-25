export default function DisplayImages({
  imageUrls,
}: {
  imageUrls: string[] | null;
}) {
  return (
    <div className="flex items-center justify-center gap-10">
      {imageUrls && (
        <div className="mt-4 flex flex-col items-center justify-center">
          <img
            src={imageUrls[0]}
            alt="Original"
            className="mb-2"
            width={250}
            height={250}
          />
          <div className="flex gap-4 items-center justify-center">
            {imageUrls.slice(1).map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Variação ${i + 1}`}
                width={250}
                height={250}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
