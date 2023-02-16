import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { fetchAllMethods} from '../../redux/slices/dictionarySlice'
import { RootState, useAppDispatch } from '../../redux';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box} from '@mui/material'
import Typography from '@mui/material/Typography';

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
  const { allMethods } = useSelector((state: RootState) => ({ ...state.dictionary }));
  const dispatch = useAppDispatch()
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

//   useEffect(() => {
//     if (allMethods.length === 0) dispatch(fetchAllMethods())
//   }, [])



  return (
    <Box>
      Methods Page

      <Box sx={{width: '80%', margin: '1% 10%'}}>
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
            <Tab label="Item One" {...a11yProps(0)} />
            <Tab label="Item Two" {...a11yProps(1)} />
            <Tab label="Item Three" {...a11yProps(2)} />
            <Tab label="Item Four" {...a11yProps(3)} />
            <Tab label="Item Five" {...a11yProps(4)} />
            <Tab label="Item Six" {...a11yProps(5)} />
            <Tab label="Item Seven" {...a11yProps(6)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque exercitationem rerum reprehenderit voluptatibus repellat quidem pariatur omnis quisquam alias laborum, non assumenda perspiciatis est voluptas, incidunt excepturi itaque nesciunt officiis nam odio similique voluptates ullam voluptatum laboriosam. Minus quibusdam commodi non nulla ducimus et nihil a, ipsa velit numquam? Rerum alias sit, consequuntur dignissimos magnam quia nostrum deleniti, voluptates libero rem earum dolorem veniam hic esse, ipsa tempora cumque ab mollitia ipsum temporibus obcaecati repellendus. Culpa, tempora asperiores dicta tempore cum iste, animi id deserunt incidunt accusantium earum accusamus corporis dolorem magnam adipisci at! Dolorem debitis cum dicta facilis rerum, suscipit, amet ratione quas eius voluptatum iusto. Labore voluptatem nesciunt saepe? Dolorem, eum. Architecto expedita quisquam odio vitae ipsa error repudiandae reprehenderit dolorum eum! Minima, exercitationem numquam quo, nesciunt ab nemo omnis nulla corporis, labore ducimus atque iste cumque suscipit natus molestiae unde quaerat eligendi est inventore laborum quasi sint? Officia aut fuga natus, nulla iste eos facilis deleniti ducimus architecto corporis distinctio iure officiis cupiditate enim quam? Quidem delectus, consequatur quod beatae vero illum ullam quos, dolorem, eius perspiciatis sint mollitia possimus magni nisi nostrum explicabo officiis? Ullam expedita maxime voluptas rerum amet, neque provident hic nihil, autem eligendi sapiente repellendus. Praesentium quidem enim corporis dolorem sequi, magni eos repellendus, cum esse nostrum ducimus necessitatibus molestiae cumque fuga culpa sapiente dolores accusamus. Cupiditate repellat sit praesentium eligendi temporibus dicta, voluptate rem. Nesciunt deserunt dolore, quod architecto dolores vitae hic asperiores impedit reiciendis assumenda. Sunt recusandae nihil voluptatum suscipit aliquam vel error, officia quia deleniti modi eum molestiae aperiam veritatis provident impedit velit itaque? Ex atque eius modi assumenda quisquam beatae provident voluptates voluptatem molestiae, nisi velit similique, nostrum fugit ratione hic odio a? Non quaerat excepturi quo suscipit laborum earum a fugiat nisi ab sit est, tempora quam fuga aliquid debitis nostrum labore, et nulla, placeat totam accusamus? At ipsam, itaque consequatur dolore veniam harum numquam, repellat vero rem soluta tempore maiores nisi, quia praesentium minima cum reprehenderit dolores ex nihil dignissimos explicabo officia! Error numquam perspiciatis sint ipsa maiores provident aliquid neque ipsum iure, eaque tempore, animi, earum maxime quibusdam hic. Labore qui quae veritatis facere maxime harum tempora ipsam vero neque aperiam eum eaque iste earum quidem cupiditate, repudiandae maiores ipsum aspernatur ullam molestias adipisci rem recusandae fuga mollitia! Rerum vero sapiente architecto id inventore exercitationem velit tempore a eius sequi fugit amet distinctio eveniet, eligendi odit labore numquam explicabo, consequuntur nihil hic sunt culpa fuga beatae. Laboriosam in eius, quibusdam ut fuga enim placeat. Sint nesciunt nobis laudantium quis! Facilis autem magnam nihil nam, maiores voluptates praesentium mollitia molestias. Sapiente pariatur mollitia nam ad tenetur est ea rem praesentium inventore debitis excepturi id voluptatum deserunt ex dolorem nostrum, ut nisi nesciunt cumque culpa perspiciatis aspernatur asperiores eveniet? Consequuntur placeat sapiente quod maiores magni architecto impedit non iste maxime repellat nisi laboriosam voluptatibus ipsa perspiciatis a dolore unde exercitationem, tenetur magnam. Eligendi at provident, illo temporibus autem numquam minus in ipsa blanditiis, suscipit laudantium cupiditate. Soluta, autem.
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
          <TabPanel value={value} index={3}>
            Item Four
          </TabPanel>
          <TabPanel value={value} index={4}>
            Item Five
          </TabPanel>
          <TabPanel value={value} index={5}>
            Item Six
          </TabPanel>
          <TabPanel value={value} index={6}>
            Item Seven
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
}