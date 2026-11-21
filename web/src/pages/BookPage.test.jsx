import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { t } from "../i18n";
import BookPage from "./BookPage";

vi.mock("../api/fetchBooks", () => ({
  fetchBookForm: vi.fn(),
  fetchExternalEnrichment: vi.fn(() => Promise.resolve(null)),
  fetchSimilarBooks: vi.fn(() => Promise.resolve({ similar: [], external: [] })),
}));
vi.mock("../api/reader", () => ({ fetchProgress: vi.fn(() => Promise.resolve({})) }));
vi.mock("../api/send", () => ({
  fetchReaderEmail: vi.fn(() => Promise.resolve({})),
  setReaderEmail: vi.fn(),
  sendBook: vi.fn(),
}));
vi.mock("../api/lists", () => ({
  fetchLists: vi.fn(() => Promise.resolve({ lists: [] })),
  toggleWishlist: vi.fn(),
}));
import { fetchBookForm } from "../api/fetchBooks";

const renderBook = () =>
  render(
    <MemoryRouter initialEntries={["/book/7"]}>
      <Routes>
        <Route path="/book/:bookId" element={<BookPage user={null} sync={false} />} />
      </Routes>
    </MemoryRouter>
  );

const book = (series) => ({
  bookForm: { BookID: 7, Title: "Ночной Дозор", Ext: "fb2", Genres: "" },
  authors: [{ AuthorID: 3, LastName: "Лукьяненко", FirstName: "Сергей" }],
  series,
});

describe("BookPage series link", () => {
  it("links the series after the authors", async () => {
    fetchBookForm.mockResolvedValue(book([{ SeriesID: 45141, SeriesTitle: "Дозоры", SeqNumber: 1 }]));
    renderBook();
    const link = await screen.findByRole("link", { name: "Дозоры" });
    expect(link.getAttribute("href")).toBe("/series/45141");
    expect(link.closest(".book-page__series-links").textContent).toBe(`${t("book.series")} Дозоры, № 1`);
  });

  it("shows nothing for a book without a series", async () => {
    fetchBookForm.mockResolvedValue(book([]));
    const { container } = renderBook();
    await screen.findByRole("link", { name: "Лукьяненко Сергей" });
    expect(container.querySelector(".book-page__series-links")).toBeNull();
  });
});
