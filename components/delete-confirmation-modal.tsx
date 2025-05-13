"use client"

<<<<<<< HEAD
import { AlertTriangle, X } from "lucide-react"
=======
import { AlertTriangle, Check, X, XIcon } from "lucide-react"
>>>>>>> tagmanagments
import { useEffect, useRef } from "react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  title: string
  description: string
<<<<<<< HEAD
  itemName: string
=======
  itemName?: string
  isErrorDeleting?:boolean
>>>>>>> tagmanagments
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmationModal({
  isOpen,
  title,
  description,
  itemName,
  isDeleting,
<<<<<<< HEAD
=======
  isErrorDeleting,
>>>>>>> tagmanagments
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-md w-full border-l-4 border-red-500 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold mb-2">{title}</h2>
                <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                {description} <span className="font-medium">{itemName}</span>?
              </p>
<<<<<<< HEAD
              <p className="text-gray-600 mb-4">This action cannot be undone.</p>

              <div className="flex justify-end gap-3">
=======
              <p className="text-gray-600 mb-4">This action cannot be undone</p>

              <div className="flex items-center justify-end gap-3">
>>>>>>> tagmanagments
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
<<<<<<< HEAD
              </div>
            </div>
          </div>
=======
                 {isErrorDeleting &&  (
            <div className="mb-4 p-2 bg-red-100 w-fit  mt-4 text-red-800 rounded-md flex items-center gap-2">
              <XIcon className="w-4 h-4" />
              <span className="capitalize text-xs">error deleting tag </span>
            </div>
          )}
              </div>
       
            </div>
           
                 
        
          </div>
             
>>>>>>> tagmanagments
        </div>
      </div>
    </div>
  )
}
