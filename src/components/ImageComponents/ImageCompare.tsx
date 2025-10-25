import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import GeneratedImage from "../../assets/generatedImage.jpeg";
import OriginalImage from "../../assets/originalImage.jpeg";

export default function ImageCompare() {
  return (
    <div className="md:w-[500px] h-auto mx-auto my-auto rounded-3xl flex justify-center overflow-hidden">
      <ReactCompareSlider
        itemOne={<ReactCompareSliderImage src={OriginalImage} alt="Original" />}
        itemTwo={
          <ReactCompareSliderImage src={GeneratedImage} alt="Generated" />
        }
        className="md:w-full md:h-full"
      />
    </div>
  );
}
