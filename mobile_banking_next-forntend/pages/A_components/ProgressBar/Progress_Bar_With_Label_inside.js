export default function Progress_Bar_With_Label_inside({ percentage }) {
    return (
        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
            <div className="bg-red-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${percentage}%` }}>
                Loading {percentage}%
            </div>
        </div>
    );
}
