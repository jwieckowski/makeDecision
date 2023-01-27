import React from 'react';
import {
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  PointerActivationConstraint,
  Modifiers,
  useSensors,
} from '@dnd-kit/core';

import {
  Axis,
  Wrapper,
} from '../stories/components';

import DraggableItem from '../DraggableItem'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../redux/reducer';
import { updateBlockPosition } from '../../../data/actions/blocks';


interface Props {
  activationConstraint?: PointerActivationConstraint;
  axis?: Axis;
  handle?: boolean;
  modifiers?: Modifiers;
  buttonStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  label?: string;
}

export default function DraggableStory({
  activationConstraint,
  axis,
  handle,
  label = 'Go ahead, drag me.',
  modifiers,
  style,
  buttonStyle,
}: Props) {
  const dispatch = useDispatch()
  const { blocks } = useSelector((state: RootState) => state.blocks)

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={(event) => {
        const _id =  +event.active.id.valueOf()
        const block = {
          _id,
          position: {
            x: blocks.filter(b => b._id === _id)[0].position.x + event.delta.x,
            y: blocks.filter(b => b._id === _id)[0].position.y + event.delta.y,
          }
        }
        dispatch(updateBlockPosition(block))
      }}
      modifiers={modifiers}
    >
      <Wrapper>
        {blocks.map(block => {
          return (
           <DraggableItem
              key={block._id}
              _id={block._id}
              axis={axis}
              type={block.type}
              label={label}
              handle={handle}
              top={block.position.y}
              left={block.position.x}
              style={style}
              buttonStyle={buttonStyle}
            />
          )
        })}
        {/* <DraggableItem
          axis={axis}
          type='method'
          label={label}
          handle={handle}
          top={y}
          left={x}
          style={style}
          buttonStyle={buttonStyle}
          />
        <DraggableItem
          axis={axis}
          type='criteria'
          label={label}
          handle={handle}
          top={y}
          left={x+50}
          style={style}
          buttonStyle={buttonStyle}
          />
        <DraggableItem
          axis={axis}
          type='alternative'
          label={label}
          handle={handle}
          top={y}
          left={x+100}
          style={style}
          buttonStyle={buttonStyle}
          />
        <DraggableItem
          axis={axis}
          type='weight'
          label={label}
          handle={handle}
          top={y}
          left={x+150}
          style={style}
          buttonStyle={buttonStyle}
          />
        <DraggableItem
          axis={axis}
          type={'ranking'}
          label={label}
          handle={handle}
          top={y}
          left={x+200}
          style={style}
          buttonStyle={buttonStyle}
          />
        <DraggableItem
          axis={axis}
          type='visualization'
          label={label}
          handle={handle}
          top={y}
          left={x+250}
          style={style}
          buttonStyle={buttonStyle}
          />
        <DraggableItem
          axis={axis}
          type='correlation'
          label={label}
          handle={handle}
          top={y}
          left={x+300}
          style={style}
          buttonStyle={buttonStyle}
        />
        <DraggableItem
          axis={axis}
          type='error'
          label={label}
          handle={handle}
          top={y}
          left={x+350}
          style={style}
          buttonStyle={buttonStyle}
        /> */}
      </Wrapper>
    </DndContext>
  );
}


