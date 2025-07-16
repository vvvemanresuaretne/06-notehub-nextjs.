import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>&copy; {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Vladyslav Vasylkovskyi</p>
          <p>
            Contact us:
            <a href="mailto:vvvasilkovskyi@gmail.com">
              vvvasilkovskyi@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}