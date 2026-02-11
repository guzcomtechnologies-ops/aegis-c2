
bootloader::entry_point!(kernel_main);

use core::panic::PanicInfo;

fn kernel_main(_boot_info: &'static bootloader::BootInfo) -> ! {
    serial_println!(NTOS
pub mod subordinate_knock;
