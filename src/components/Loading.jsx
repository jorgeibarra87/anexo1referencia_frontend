
const spinnerLoginText = (text) => {
    const inputOptions = new Promise(() => {
        setTimeout(() => {
        }, 1000);
    });
    // Swal.fire({
    //     title: `${text == null ? 'Loading...' : text}`,
    //     input: "radio",
    //     focusConfirm: false,
    //     allowOutsideClick: false,
    //     inputOptions,
    // });
};

export default spinnerLoginText;