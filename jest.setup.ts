import "@testing-library/jest-dom";
import React from "react";

const notFoundMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  notFound: () => notFoundMock(),
}));

export { notFoundMock };

jest.mock("next/image", () => ({
  __esModule: true,
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & {
      fill?: boolean;
      priority?: boolean;
    }
  ) => {
    const { fill, priority, ...imgProps } = props;
    void fill;
    void priority;
    return React.createElement("img", { ...imgProps, alt: imgProps.alt ?? "" });
  },
}));
