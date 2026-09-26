'use strict';

function libcFromReport(report) {
  if (!report) {
    return null;
  }
  if (report.header && report.header.glibcVersionRuntime) {
    return 'glibc';
  }
  const shared = Array.isArray(report.sharedObjects) ? report.sharedObjects : [];
  return shared.some((file) => String(file).includes('ld-musl-')) ? 'musl' : null;
}

module.exports = libcFromReport;
