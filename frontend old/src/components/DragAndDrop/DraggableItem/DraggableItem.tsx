import {
  useDraggable
} from '@dnd-kit/core';

import {
    Axis,
    Draggable
  } from '../stories/components';
  

interface DraggableItemProps {
    _id: number;
    label: string;
    type: string;
    handle?: boolean;
    style?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    axis?: Axis;
    top?: number;
    left?: number;
}
  
export default function DraggableItem({
    _id,
    axis,
    type,
    label,
    style,
    top,
    left,
    handle,
    buttonStyle,
    }: DraggableItemProps) {
    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        transform,
    } = useDraggable({
        id: _id,
    });

    return (
        <Draggable
            ref={setNodeRef}
            dragging={isDragging}
            handle={handle}
            label={label}
            type={type}
            listeners={listeners}
            style={{...style, top, left}}
            buttonStyle={buttonStyle}
            transform={transform}
            axis={axis}
            {...attributes}
        />
    );
}
  
  