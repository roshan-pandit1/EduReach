export default function Footer() {
  return (
    <footer className="bg-muted py-6 px-4 mt-8">
      <div className="container mx-auto text-center">
        <p className="text-sm text-muted-foreground">EduReach - Bringing quality education to remote areas</p>
        <p className="text-xs text-muted-foreground mt-2">
          © {new Date().getFullYear()} EduReach. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

