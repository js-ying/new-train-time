import { FC } from "react";
import Lightbox, { Slide } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// plugins
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

interface CommonLightboxProps {
  slides: Slide[];
  index: number;
  open: boolean;
  onClose: () => void;
}

const CommonLightbox: FC<CommonLightboxProps> = ({
  slides,
  index,
  open,
  onClose,
}) => {
  return (
    <Lightbox
      slides={slides}
      open={open}
      index={index}
      close={onClose}
      animation={{ swipe: 350 }}
      controller={{ closeOnBackdropClick: true }}
      carousel={{ padding: 16 }}
      plugins={[Counter, Zoom]}
      counter={{
        style: { fontSize: 12, margin: 0, marginLeft: 10 },
      }}
      styles={{
        icon: { height: 22, width: 22 },
        container: { backgroundColor: "rgba(0, 0, 0, .8)" },
      }}
    />
  );
};

export default CommonLightbox;
