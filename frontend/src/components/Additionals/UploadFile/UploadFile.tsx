import {useState, useEffect, ChangeEvent} from 'react';
import * as XLSX from 'xlsx';
import {Box, Typography} from '@mui/material'
import IconButton from '@mui/material/IconButton';
import CloudUpload from '@mui/icons-material/CloudUpload'
import { HIDE_DURATION } from '../../../common/const';

import {useSelector} from 'react-redux'
import { RootState, useAppDispatch } from '../../../redux';
import { useSnackbar } from 'notistack'
import { addMatrixFile, setCriteria } from '../../../redux/slices/calculationSlice';
import { setBlockMatrixFile, setBlockFileName } from '../../../redux/slices/blocksSlice'
import { BlockType } from '../../../redux/types';

export default function UploadFile() {
  const {activeBlock, blocks} = useSelector((state: RootState) => state.blocks)
  const [block, setBlock] = useState<BlockType | null>(null)
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setBlock(blocks.filter(b => b._id === activeBlock?.id)[0])
  }, [blocks])

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const name = e.target.files[0].name

      // FOR JSON FILES
      if (e.target.files[0].type.includes('json')) {
        const fileReader = new FileReader()
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
          if (e !== null && e.target !== null) {
            const data = JSON.parse(e.target.result as string)
            // verify if json has required keys
            if (!Object.keys(data).includes('matrix')) {
              enqueueSnackbar(`Uploaded JSON file does not contain "matrix" key`, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
              return
            }
            if (!Object.keys(data).includes('criteriaTypes')) {
              enqueueSnackbar(`Uploaded JSON file does not contain "criteriaTypes" key`, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
              return
            }
            
            if (data.matrix.length > 0) dispatch(setCriteria(data.matrix[0].length))
            dispatch(addMatrixFile(e.target.result))
            dispatch(setBlockMatrixFile({
              id: activeBlock?.id,
              data: e.target.result
            }))
            dispatch(setBlockFileName({
              id: activeBlock?.id,
              data: name
            }))
          }
        };
      }

      // FOR CSV FILES
      if (e.target.files[0].type.includes('csv')) {
        let reader = new FileReader();
        reader.onload = function(e) {
          // Use reader.result
          if (reader.result?.toString() === undefined) return
          if (reader.result?.toString().split('\r\n').length > 0) dispatch(setCriteria(reader.result?.toString().split('\r\n')[0].split(', ').length))
          else {
            enqueueSnackbar(`Uploaded CSV file is empty`, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
            return
          }

          dispatch(addMatrixFile(reader.result))
          dispatch(setBlockMatrixFile({
            id: activeBlock?.id,
            data: reader.result
          }))
          dispatch(setBlockFileName({
            id: activeBlock?.id,
            data: name
          }))
        }
        reader.readAsText(e.target.files[0]);
      }
      
      // FOR XLSX FILES
      if (e.target.files[0].type.includes('sheet')) {
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: number[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });
        
        if (jsonData.length > 0) {
          if (jsonData[0].length > 0) {
            dispatch(setCriteria(jsonData[0].length))
          }
        } else {
          enqueueSnackbar(`Uploaded XLSX file is empty`, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
          return
        }
        
        dispatch(addMatrixFile(jsonData))
        dispatch(setBlockMatrixFile({
          id: activeBlock?.id,
          data: JSON.stringify(jsonData)
        }))
        dispatch(setBlockFileName({
          id: activeBlock?.id,
          data: name
        }))
      }
    }
  };

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 4}}>
      <Box sx={{border: '1px solid grey', borderRadius: 5}}>
        <IconButton color="primary" aria-label="upload picture" component="label" sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', p: 5}}>
          <input 
              hidden 
              accept="text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json" 
              type="file"
              onChange={handleFileChange}
          />
          <CloudUpload fontSize='large'/>
          <Typography>
            Kliknij żeby przesłać plik
          </Typography>
        </IconButton>
      </Box>
      { (block !== null && block.data.fileName !== null) &&
        <Box sx={{maxWidth: '300px', overflow: 'auto'}}>
          <Typography sx={{mt: 2}} variant='body1'>
            Załadowany plik: {block.data.fileName}
          </Typography>
        </Box>
      }
    </Box>
  );
}