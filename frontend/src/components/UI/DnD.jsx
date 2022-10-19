import { useState, useMemo } from 'react'
import Grid from '@mui/material/Grid'
import DraggableStory from '../DragAndDrop/DraggableStory'
import {
    Grid as BoxGrid,
  } from '../DragAndDrop/stories/components';
import {
    createSnapModifier
  } from '@dnd-kit/modifiers';

export default function DnD() {
    const [gridSize, setGridSize] = useState(30);
    const style = {
      alignItems: 'flex-start',
      zIndex: 3
    };
    const buttonStyle = {
      marginLeft: gridSize - 20 + 1,
      marginTop: gridSize - 20 + 1,
      width: gridSize * 8 - 1,
      height: gridSize * 2 - 1,
    };
    const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);
  
    return (
      <Grid style={{width: '100%', height: '100%', position: 'relative', overflow: 'auto'}}>
        <BoxGrid size={gridSize} onSizeChange={setGridSize} />
        <DraggableStory
          modifiers={[snapToGrid]}
          style={style}
          buttonStyle={buttonStyle}
          key={gridSize}
        />
      </Grid>
    );
}