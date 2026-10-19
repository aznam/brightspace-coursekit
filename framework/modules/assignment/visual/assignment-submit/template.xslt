<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
    version="1.0">

    <xsl:output method="xml" omit-xml-declaration="yes"/>

    <xsl:template match="/">
        <section class="ck-assignment-submit" aria-label="Assignment submission">
            <h2 class="ck-assignment-submit__title">Submit</h2>
            <div class="ck-assignment-submit__action">
                <a class="ck-assignment-submit__button" target="_top" aria-disabled="true" tabindex="-1">Submission Closed</a>
            </div>
        </section>
    </xsl:template>
</xsl:stylesheet>
