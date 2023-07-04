type VideoContentContainerParams = {
  videoUrl: string;
};

export default function VideoContentContainer({
  videoUrl,
}: VideoContentContainerParams) {
  return (
    <div className="m-auto w-full">
      <div className="aspect-video">
        <iframe
          src={videoUrl}
          className="h-full w-full border-none"
          allow="autoplay; fullscreen;"
        />
      </div>
    </div>
  );
}