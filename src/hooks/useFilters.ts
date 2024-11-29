import { genderList, orderByList } from "@/constant";
import { Selection } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useShallow } from "zustand/react/shallow";
import useFilterStore from "./useFilterStore";
import usePaginationStore from "./usePaginationStore";

export const useFilters = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { filters, setFilters } = useFilterStore();
  const { gender, ageRange, orderBy, withPhoto } = filters;
  const [isPending, startTransition] = React.useTransition();
  const [hasNavigated, setHasNavigated] = React.useState(false);
  const prevDependencies = React.useRef({
    gender,
    ageRange,
    orderBy,
    withPhoto,
  });
  const { pageNumber, pageSize, setPage, totalCount } = usePaginationStore(
    useShallow((state) => ({
      pageNumber: state.pagination.pageNumber,
      pageSize: state.pagination.pageSize,
      setPage: state.setPage,
      totalCount: state.pagination.totalCount,
    }))
  );

  React.useEffect(() => {
    const dependenciesChanged =
      gender !== prevDependencies.current.gender ||
      ageRange !== prevDependencies.current.ageRange ||
      orderBy !== prevDependencies.current.orderBy ||
      withPhoto !== prevDependencies.current.withPhoto;

    if (dependenciesChanged || hasNavigated) {
      if (dependenciesChanged) {
        setPage(1);
      }
      prevDependencies.current = { gender, ageRange, orderBy, withPhoto };
    } else {
      setHasNavigated(true);
    }
  }, [gender, ageRange, orderBy, withPhoto, setPage, hasNavigated]);

  React.useEffect(() => {
    startTransition(() => {
      const searchParams = new URLSearchParams();
      if (gender) searchParams.set("gender", gender.join(","));
      if (ageRange) searchParams.set("ageRange", ageRange.toString());
      if (orderBy) searchParams.set("orderBy", orderBy);
      if (pageSize) searchParams.set("pageSize", pageSize.toString());
      if (pageNumber) searchParams.set("pageNumber", pageNumber.toString());
      searchParams.set("withPhoto", withPhoto.toString());
      router.replace(`${pathname}?${searchParams}`);
    });
  }, [
    ageRange,
    orderBy,
    gender,
    router,
    pathname,
    withPhoto,
    pageNumber,
    pageSize,
  ]);

  const handleAgeSelect = (value: number[]) => {
    setFilters("ageRange", value);
  };

  const handleOrderSelect = (value: Selection) => {
    if (value instanceof Set) {
      setFilters("orderBy", value.values().next().value);
    }
  };

  const handleGenderSelect = (value: string) => {
    if (gender.includes(value))
      setFilters(
        "gender",
        gender.filter((genderValue) => genderValue !== value)
      );
    else setFilters("gender", [...gender, value]);
  };

  const handleWithPhotoToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters("withPhoto", e.target.checked);
  };

  return {
    orderByList,
    genderList,
    selectAge: handleAgeSelect,
    selectGender: handleGenderSelect,
    selectOrder: handleOrderSelect,
    selectWithPhoto: handleWithPhotoToggle,
    filters,
    totalCount,
    isPending,
  };
};
