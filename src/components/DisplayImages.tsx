export default function DisplayImages({
  imageUrls,
}: {
  imageUrls: string[] | null;
}) {
  return (
    <div>
      {imageUrls && (
        <div className="mt-4">
          <p>Original:</p>
          <img src={imageUrls[0]} alt="Original" className="mb-2" />
          <p>Variações:</p>
          <div className="flex gap-2">
            {imageUrls.slice(1).map((url, i) => (
              <img key={i} src={url} alt={`Variação ${i + 1}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
