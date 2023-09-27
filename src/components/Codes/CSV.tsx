import React from 'react';

type CsvCodesProps = {
  data: string | any[][];
};

export default function CsvCodes({ data }: CsvCodesProps) {
  return (
    <div>
      <pre>{data}</pre>
    </div>
  );
}
