import ProfileCard from "./ProfileCard";
import InfoSection from "./InfoSection";
import { ProfileProvider } from "../../../context/ProfileContext";

export default function Profile() {
  return (
    <ProfileProvider>
      <div className="p-1 sm:p-2">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* LEFT */}
          <div className="lg:col-span-1 self-start">
            <ProfileCard title="Preview" />
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <InfoSection title="Personal Information" />
          </div>
        </div>
      </div>
    </ProfileProvider>
  );
}
