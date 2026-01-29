import React from 'react';

export default function LicensePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        GNU Affero General Public License v3.0
      </h1>

      <div className="prose dark:prose-invert max-w-none rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-4 font-bold">
          Copyright (c) {new Date().getFullYear()} SimpleDevs
        </p>

        <p className="mb-4">
          This program is free software: you can redistribute it and/or modify
          it under the terms of the GNU Affero General Public License as
          published by the Free Software Foundation, either version 3 of the
          License, or (at your option) any later version.
        </p>

        <p className="mb-4">
          This program is distributed in the hope that it will be useful, but
          WITHOUT ANY WARRANTY; without even the implied warranty of
          MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
          Affero General Public License for more details.
        </p>

        <p className="mb-4">
          You should have received a copy of the GNU Affero General Public
          License along with this program. If not, see{' '}
          <a
            href="https://www.gnu.org/licenses/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:underline"
          >
            https://www.gnu.org/licenses/
          </a>
          .
        </p>

        <hr className="my-6 border-gray-300 dark:border-gray-600" />

        <h3 className="mb-2 text-lg font-bold">Key Permissions:</h3>
        <ul className="mb-4 list-disc space-y-1 pl-5">
          <li>Commercial use</li>
          <li>Modification</li>
          <li>Distribution</li>
          <li>Patent use</li>
          <li>Private use</li>
        </ul>

        <h3 className="mb-2 text-lg font-bold">Key Conditions:</h3>
        <ul className="mb-4 list-disc space-y-1 pl-5">
          <li>License and copyright notice</li>
          <li>State changes</li>
          <li>Disclose source</li>
          <li>
            Network use is distribution (if you run it on a server, users must
            have access to source)
          </li>
          <li>Same license (AGPL v3)</li>
        </ul>

        <h3 className="mb-2 text-lg font-bold">Key Limitations:</h3>
        <ul className="mb-4 list-disc space-y-1 pl-5">
          <li>Liability</li>
          <li>Warranty</li>
        </ul>
      </div>
    </div>
  );
}
