import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
//temporary images
import GeneratedImage from "../assets/Generated_Image.png";
import OriginalImage from "../assets/Original_Image.jpg";

export default function ImageCompare() {
  return (
    <div className="max-w-xl rounded-2xl overflow-hidden">
      <ReactCompareSlider
        itemOne={<ReactCompareSliderImage src={OriginalImage} alt="Original" />}
        itemTwo={
          <ReactCompareSliderImage src={GeneratedImage} alt="Generated" />
        }
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
