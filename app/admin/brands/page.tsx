"use client";
import { useState, useEffect } from "react";

import BrandTable from "@/app/components/tables/brand/BrandTable";

export default function BrandsPage() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);
  if (isLoading) return <p >Loading...</p>;
  if (!data) return <p>No data</p>;
  return (
    <div>
      <BrandTable initialData={data} />
    </div>
  );
}
