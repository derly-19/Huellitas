export default function AddRecordButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#BCC990] text-gray-800 px-4 py-2 rounded-lg hover:bg-[#A5B67F] transition-colors font-medium flex items-center gap-2 mb-4"
    >
      <span className="text-lg">+</span>
      {label}
    </button>
  );
}