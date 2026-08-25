import { CompatibleProducts } from "../CompatibleProucts";
import { Card } from "./card";

type Props = {
  id: string;
};
export const CompatibleProductsCard = ({ id }: Props) => {
  return (
    <Card className="overflow-hidden rounded-2xl px-4 py-6 sm:px-7 sm:py-7">
      <h2 className="mb-6 text-xl font-bold text-zinc-900">
        Сопутствующие товары
      </h2>
      <CompatibleProducts cartProductIds={[id]} />
    </Card>
  );
};
