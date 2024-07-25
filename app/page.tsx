import ThreeScene from "../Components/ThreeScene";
import SimpleLink from "../Components/SimpleLink";

export default function Home() {
  return (
    <main>
      <ThreeScene />
      <div className="absolute top-0 left-0">
        <div className="m-4 flex flex-col gap-2">
          <SimpleLink url="/galaxy" name="/galaxy" />
          <SimpleLink url="/logic" name="/logic" />
          <SimpleLink url="/note" name="/note" />
        </div>
      </div>
    </main>
  );
}