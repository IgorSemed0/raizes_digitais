"use client"

import React, { createContext, useContext, useReducer } from "react"

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export type ToastAction = 
  | { type: "ADD_TOAST"; toast: Omit<Toast, "id"> }
  | { type: "UPDATE_TOAST"; id: string; toast: Partial<Toast> }
  | { type: "DISMISS_TOAST"; id: string }
  | { type: "REMOVE_TOAST"; id: string }

export interface ToastState {
  toasts: Toast[]
}

export interface ToastContextType {
  toasts: Toast[]
  toast: (props: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [
          ...state.toasts,
          {
            id: Math.random().toString(36).substring(2, 9),
            ...action.toast,
          },
        ],
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, visible: false } : t
        ),
      }

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      }

    default:
      return state
  }
}

// ============================================================================
// CONTEXT
// ============================================================================
const ToastContext = createContext<ToastContextType | undefined>(undefined)

const initialState: ToastState = {
  toasts: [],
}

interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [state, dispatch] = useReducer(toastReducer, initialState)

  const toast = (props: Omit<Toast, "id">) => {
    dispatch({
      type: "ADD_TOAST",
      toast: props,
    })
  }

  const dismiss = (id: string) => {
    dispatch({ type: "DISMISS_TOAST", id })
    
    // Remove após animação
    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", id })
    }, 300)
  }

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        toast,
        dismiss,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext)
  
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return context
}