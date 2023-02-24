import React, {useState, useEffect} from 'react';
import { RootState} from '../../redux';
import { useSelector } from 'react-redux';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import MarkdownText from '../MarkdownText'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2, width: '100%', display: 'flex', justifyContent: 'center'}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function MethodTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          {children}
        </>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function DescriptionsMenu() {
  const {methods} = useSelector((state: RootState) => state.description)
  const [typeIndex, setTypeIndex] = useState(0);
  const [methodIndex, setMethodIndex] = useState(0);

  useEffect(() => {
    setMethodIndex(0)
  }, [typeIndex])

  const handleTypeChange = (event: React.SyntheticEvent, newValue: number) => {
    setTypeIndex(newValue);
  };

  const handleMethodChange = (event: React.SyntheticEvent, newValue: number) => {
    setMethodIndex(newValue);
  };


  return (
    <Box sx={{ width: '100%', mt: 3}}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={typeIndex} onChange={handleTypeChange} aria-label="Menu of methods with their mathematical descriptions" centered>
          {
            methods.map(method => {
                return <Tab label={method.key} {...a11yProps(method.id)}/>
            })
          }
        </Tabs>
      </Box>
      {
        methods.length > 0 && 
        methods.map((method, idx) => {
            return (
                <TabPanel value={typeIndex} index={idx}>
                    <Box>
                        <Tabs
                            // orientation="horizontal"
                            variant="scrollable"
                            value={methodIndex}
                            onChange={handleMethodChange}
                            aria-label="Menu of techniques from selected methods"
                            centered
                            sx={{width: '100%'}}
                        >
                            {
                                method.data.map((data, id) => {
                                    return <Tab label={data.name} {...a11yProps(id)} />
                                })
                            }
                        </Tabs>
                            {method.data.map((data, id) => {
                                return (
                                    <MethodTabPanel value={methodIndex} index={id}>
                                        <Box sx={{width: '60%', margin: '20px auto'}}>
                                            {data.description.map(d => {
                                                return <MarkdownText text={d.text} key={`text${d.id}`}/>
                                            })}
                                        </Box>
                                    </MethodTabPanel>
                                )
                            })}
                    </Box>
                </TabPanel>
            )
        })
      }
    </Box>
  );
}