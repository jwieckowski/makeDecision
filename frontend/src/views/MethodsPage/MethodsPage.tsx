import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { getMethodsDescriptions } from '../../redux/slices/descriptionSlice'
import { RootState, useAppDispatch } from '../../redux';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box} from '@mui/material'
import Typography from '@mui/material/Typography';

import MarkdownText from '../../components/MarkdownText';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{width: '100%', padding: 5}}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


export default function MethodsPage() {
  const { methods } = useSelector((state: RootState) => ({ ...state.description }));
  const dispatch = useAppDispatch()
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (methods.length === 0) dispatch(getMethodsDescriptions())
  }, [])


  return (
    <Box>
      Methods Page
      {methods.length > 0 && 
        <Box sx={{width: '50%', margin: '1% 25%'}}>
          {methods[0].data[0].description.map(d => {
            return <MarkdownText text={d.text} key={d.id} />
          })}
        </Box>
      }

      {/* <Box sx={{width: '80%', margin: '1% 10%'}}>
        <Box
          sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 600 }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            {
              allMethods.map(methods => {
                return <Tab label={methods.key} {...a11yProps(methods.id)}/>
              })
            }
          </Tabs>
        

          <TabPanel value={value} >
            
          // </TabPanel>
          <TabPanel value={value} index={1}>
          //   Item Two
          // </TabPanel>
          // <TabPanel value={value} index={2}>
          //   Item Three
          // </TabPanel>
          // <TabPanel value={value} index={3}>
          //   Item Four
          // </TabPanel>
          // <TabPanel value={value} index={4}>
          //   Item Five
          // </TabPanel>
          // <TabPanel value={value} index={5}>
          //   Item Six
          // </TabPanel>
          // <TabPanel value={value} index={6}>
          //   Item Seven
          // </TabPanel>
        </Box>
      </Box> */}
    </Box>
  );
}