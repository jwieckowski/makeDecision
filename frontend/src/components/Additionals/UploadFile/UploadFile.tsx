import {ChangeEvent, useState} from 'react';
import * as XLSX from 'xlsx';
import {Box, Typography} from '@mui/material'
import IconButton from '@mui/material/IconButton';
import CloudUpload from '@mui/icons-material/CloudUpload'


import {useSelector} from 'react-redux'
import { RootState, useAppDispatch } from '../../../redux';
import { addMatrixFile, addMatrixFileName } from '../../../redux/slices/calculationSlice';

type UploadFileProps = {
  id: number
}

export default function UploadFile({id} : UploadFileProps) {
  const {matrixFileNames} = useSelector((state: RootState) => state.calculation)
  const dispatch = useAppDispatch()
  
  const getMatrixFileName = () => {
    return matrixFileNames.length < id+1 ? '' : matrixFileNames[id]
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      dispatch(addMatrixFileName({name: e.target.files[0].name, id: id}))

      // FOR JSON FILES
      if (e.target.files[0].type.includes('json')) {
        const fileReader = new FileReader()
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
          if (e !== null && e.target !== null) {
            dispatch(addMatrixFile(e.target.result))
          }
        };
      }

      // FOR CSV FILES
      if (e.target.files[0].type.includes('csv')) {
        let reader = new FileReader();
        reader.onload = function(e) {
          // Use reader.result
          // alert(reader.result)
          dispatch(addMatrixFile(reader.result))
        }
        reader.readAsText(e.target.files[0]);
      }

      // FOR XLSX FILES
      if (e.target.files[0].type.includes('sheet')) {
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });
        dispatch(addMatrixFile(jsonData))
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
      { getMatrixFileName() !== '' &&
        <Box sx={{maxWidth: '300px', overflow: 'auto'}}>
          <Typography sx={{mt: 2}} variant='body1'>
            Załadowany plik: {getMatrixFileName()}
          </Typography>
        </Box>
      }
    </Box>
  );
}