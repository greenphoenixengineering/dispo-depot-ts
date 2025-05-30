import { Tag } from "@/libs/tagTypes";
import { ChevronDown, Search, X } from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

interface MultiSelectTagsDropDownProps {
  tags: Tag[];
  //   searchTerm: string;
  selectedTagObjects: Tag[];

  setSelectedTagObjects: Dispatch<SetStateAction<Tag[]>>;
}
const MultiSelectTagsDropDown = ({
  tags,
  setSelectedTagObjects,
  selectedTagObjects,
}: MultiSelectTagsDropDownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Dropdown Logic (adapted for any objects) ---
  const toggleTagInSelection = (tagToToggle: any) => {
    setSelectedTagObjects((prevSelected) =>
      prevSelected.some((t) => t.api_id === tagToToggle.api_id)
        ? prevSelected.filter((t) => t.api_id !== tagToToggle.api_id)
        : [...prevSelected, tagToToggle]
    );
  };

  console.log("selected tags",selectedTagObjects)

  const removeTagFromSelection = (tagToRemove: any) => {
    setSelectedTagObjects((prevSelected) =>
      prevSelected.filter((t) => t.api_id !== tagToRemove.api_id)
    );
  };

  // Tags available to be shown in the dropdown list (not yet selected, and matching search)
  const tagsAvailableInDropdown = tags
    .filter(
      (tag) =>
        !selectedTagObjects.some((selected) => selected.api_id === tag.api_id)
    )
    .filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- useEffect to close dropdown on outside click (from new UI) ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Tags to Target
      </label>

      {/* Selected Tags Display */}
      {selectedTagObjects.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTagObjects.map((tag) => (
            <div
              key={tag.api_id} 
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
            >
              <span>{tag.name}</span>
              <button
                type="button"
                onClick={() => removeTagFromSelection(tag)}
                className="text-green-800 hover:text-green-900 ml-1 p-0.5 rounded-full hover:bg-green-200"
                aria-label={`Remove ${tag.name} tag`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Multi-Select Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 flex items-center justify-between"
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
        >
          <span className="text-gray-500">
            {selectedTagObjects.length === 0
              ? "Select tags..."
              : `${selectedTagObjects.length} tag(s) selected`}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  aria-label="Search tags"
                />
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto" role="listbox">
              {tagsAvailableInDropdown.length > 0 ? (
                tagsAvailableInDropdown.map((tag) => (
                  <button
                    key={tag.api_id} 
                    type="button"
                    onClick={() => {
                      toggleTagInSelection(tag);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    role="option"
                    aria-selected={selectedTagObjects.some(
                      (st) => st.api_id === tag.api_id
                    )} 
                  >
                    {tag.name}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  {searchTerm
                    ? "No tags found matching your search."
                    : tags.length > 0 &&
                      tags.every((t) =>
                        selectedTagObjects.some((st) => st.api_id === t.api_id)
                      )
                    ? "All available tags are selected."
                    : tags.length === 0
                    ? "No tags available to select."
                    : "No unselected tags match the criteria."}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectTagsDropDown;
