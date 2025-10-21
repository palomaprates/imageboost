import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import GeneratedImage from "../../assets/GeneratedImage.jpeg";
import OriginalImage from "../../assets/OriginalImage.jpeg";

export default function ImageCompare() {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <ReactCompareSlider
        itemOne={<ReactCompareSliderImage src={OriginalImage} alt="Original" />}
        itemTwo={
          <ReactCompareSliderImage src={GeneratedImage} alt="Generated" />
        }
        style={{ width: "800px", height: "700px" }}
      />
    </div>
  );
}
