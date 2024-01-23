type JsonCodesProps = {
  data: string | any[][];
};

export default function JsonCodes({ data }: JsonCodesProps) {
  return (
    <div>
      <pre>{data}</pre>
    </div>
  );
}
