"use client";
import ItemTable from "@/app/components/tables/item/ItemTable";
import { Brand } from "@prisma/client";
import { useState, useEffect } from "react";

export default function BrandsPage() {
  const [data, setData] = useState(null);
  const [brandList, setBrandList] = useState<Brand[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((brandList) => {
        setBrandList(brandList.data);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;
  return (
    <div>
      <ItemTable initialData={data} brands={brandList} />
    </div>
  );
}
