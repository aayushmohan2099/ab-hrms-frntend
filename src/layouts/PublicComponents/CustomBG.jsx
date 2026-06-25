// src/layouts/PublicComponents/CustomBG.jsx
import bg from "../../assets/SlideShow/slide_1.jpeg";

export function CustomBG() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <img
        src={bg}
        className="h-full w-full object-cover scale-110 blur-[4px] brightness-75 contrast-110 saturate-110"
      />
    </div>
  );
}
