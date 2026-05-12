const Loader = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-transparent z-[1050] pointer-events-none">
  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent pointer-events-auto"></div>
</div>

  );
};

export default Loader;
