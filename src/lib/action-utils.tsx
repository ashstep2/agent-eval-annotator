import {
  MousePointer2,
  Type,
  ArrowUpDown,
  Wrench,
  Globe,
  Clock,
  ChevronDown,
  Hand,
  Keyboard,
} from 'lucide-react';
import { AgentStep } from '@/types';

/**
 * Icon size variants for action icons
 */
export type ActionIconSize = 'sm' | 'md';

const iconSizeClasses: Record<ActionIconSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
};

/**
 * Get the icon component for an action type
 */
export function getActionIcon(type: string, size: ActionIconSize = 'sm'): React.ReactNode {
  const className = iconSizeClasses[size];

  const icons: Record<string, React.ReactNode> = {
    click: <MousePointer2 className={className} />,
    type: <Type className={className} />,
    scroll: <ArrowUpDown className={className} />,
    tool_call: <Wrench className={className} />,
    navigate: <Globe className={className} />,
    wait: <Clock className={className} />,
    select: <ChevronDown className={className} />,
    hover: <Hand className={className} />,
    key_press: <Keyboard className={className} />,
  };

  return icons[type] || null;
}

/**
 * Get a short label for an action type
 */
export function getActionLabel(type: string): string {
  const labels: Record<string, string> = {
    click: 'Click',
    type: 'Type',
    scroll: 'Scroll',
    tool_call: 'Tool',
    navigate: 'Nav',
    wait: 'Wait',
    select: 'Select',
    hover: 'Hover',
    key_press: 'Key',
  };
  return labels[type] || type;
}

/**
 * Format action details as a human-readable string
 */
export function formatActionDetails(action: AgentStep['action']): string {
  switch (action.type) {
    case 'click':
      return `Click at (${action.coordinates.x}, ${action.coordinates.y})${action.element ? ` on "${action.element}"` : ''}`;
    case 'type':
      return `Type "${action.text}"${action.element ? ` into "${action.element}"` : ''}`;
    case 'scroll':
      return `Scroll ${action.direction} by ${action.amount}px`;
    case 'navigate':
      return `Navigate to ${action.url}`;
    case 'tool_call':
      return `Call ${action.toolName}(${JSON.stringify(action.arguments)})`;
    case 'wait':
      return `Wait ${action.duration}ms${action.condition ? ` for "${action.condition}"` : ''}`;
    default:
      return JSON.stringify(action);
  }
}
