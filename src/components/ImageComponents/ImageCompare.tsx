import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import GeneratedImage from "../../assets/GeneratedImage.jpeg";
import OriginalImage from "../../assets/OriginalImage.jpeg";

export default function ImageCompare() {
  return (
    <div className="md:w-full md:h-full mx-auto my-auto rounded-2xl overflow-hidden">
      <ReactCompareSlider
        itemOne={<ReactCompareSliderImage src={OriginalImage} alt="Original" />}
        itemTwo={
          <ReactCompareSliderImage src={GeneratedImage} alt="Generated" />
        }
        className="md:w-[800px] md:h-[700px] "
      />
    </div>
  );
}
